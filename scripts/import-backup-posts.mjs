import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const defaultInputPath = path.resolve(repoRoot, "..", "备份-2026-06-30.json");
const outputRoot = path.join(
	repoRoot,
	"src",
	"content",
	"posts",
	"imported",
	"backup-2026-06-30",
);

function sanitizePathSegment(value, fallback) {
	const trimmed = value.trim();
	if (trimmed === "") {
		return fallback;
	}

	return trimmed
		.replace(/[<>:"/\\|?*\u0000-\u001f]/g, "-")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")
		.replace(/^[-.]+|[-.]+$/g, "") || fallback;
}

function createAsciiSlug(article) {
	const explicitPath = article.pathname.trim();
	if (explicitPath !== "") {
		return sanitizePathSegment(explicitPath.toLowerCase(), `post-${article.id}`);
	}

	const normalizedTitle = article.title
		.normalize("NFKD")
		.toLowerCase()
		.replace(/[\u0300-\u036f]/g, "");
	const asciiWords = normalizedTitle.match(/[a-z0-9]+/g) ?? [];
	const base = asciiWords.slice(0, 8).join("-");
	const datePrefix = article.createdAt.slice(0, 10);

	if (base !== "") {
		return `${datePrefix}-${base}-${article.id}`;
	}

	return `${datePrefix}-post-${article.id}`;
}

function stripMarkdown(value) {
	return value
		.replace(/```[\s\S]*?```/g, " ")
		.replace(/`[^`]*`/g, " ")
		.replace(/!\[[^\]]*]\([^)]*\)/g, " ")
		.replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
		.replace(/<[^>]+>/g, " ")
		.replace(/^#{1,6}\s+/gm, "")
		.replace(/^\s*[-*+]\s+/gm, "")
		.replace(/\r?\n+/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

function createDescription(content) {
	const excerpt = content.split("<!-- more -->")[0] ?? content;
	const plainText = stripMarkdown(excerpt);
	if (plainText.length <= 140) {
		return plainText;
	}

	return `${plainText.slice(0, 137).trimEnd()}...`;
}

function frontmatterLine(key, value) {
	if (Array.isArray(value)) {
		return `${key}: ${JSON.stringify(value)}`;
	}

	if (typeof value === "boolean") {
		return `${key}: ${value}`;
	}

	if (typeof value === "string") {
		return `${key}: ${JSON.stringify(value)}`;
	}

	return `${key}: ${value}`;
}

function buildFrontmatter(article, slug) {
	const lines = [
		"---",
		frontmatterLine("title", article.title),
		`published: ${article.createdAt}`,
	];

	if (article.updatedAt !== article.createdAt) {
		lines.push(`updated: ${article.updatedAt}`);
	}

	lines.push(frontmatterLine("description", createDescription(article.content)));
	lines.push(frontmatterLine("tags", article.tags));
	lines.push(frontmatterLine("category", article.category.trim()));
	lines.push(frontmatterLine("author", article.author.trim()));
	lines.push(frontmatterLine("pinned", article.top > 0));
	lines.push(frontmatterLine("draft", article.hidden || article.private));
	lines.push(frontmatterLine("slug", slug));

	if (article.password.trim() !== "") {
		lines.push(frontmatterLine("password", article.password));
	}

	lines.push("---", "");
	return lines.join("\n");
}

function buildPostFile(article, slug) {
	const frontmatter = buildFrontmatter(article, slug);
	return `${frontmatter}${article.content.trim()}\n`;
}

async function main() {
	const inputPath = process.argv[2]
		? path.resolve(process.argv[2])
		: defaultInputPath;
	const jsonText = await readFile(inputPath, "utf8");
	const backup = JSON.parse(jsonText);

	if (!Array.isArray(backup.articles)) {
		throw new Error("Backup JSON does not contain an articles array.");
	}

	const usedSlugs = new Set();

	for (const article of backup.articles) {
		const categoryDir = sanitizePathSegment(article.category, "未分类");
		const baseSlug = createAsciiSlug(article);
		let slug = baseSlug;
		let suffix = 2;

		while (usedSlugs.has(slug)) {
			slug = `${baseSlug}-${suffix}`;
			suffix += 1;
		}
		usedSlugs.add(slug);

		const targetDir = path.join(outputRoot, categoryDir);
		const targetFile = path.join(targetDir, `${slug}.md`);

		await mkdir(targetDir, { recursive: true });
		await writeFile(targetFile, buildPostFile(article, slug), "utf8");
	}

	console.log(
		`Imported ${backup.articles.length} posts into ${path.relative(repoRoot, outputRoot)}`,
	);
}

await main();
