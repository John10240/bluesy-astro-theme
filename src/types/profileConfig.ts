export type ProfileConfig = {
	avatar?: string;
	/** 个人资料卡头像的外观；默认使用圆角矩形。 */
	avatarShape?: "rounded" | "circle";
	name: string;
	bio?: string;
	links: {
		name: string;
		url: string;
		icon: string;
		showName?: boolean;
	}[];
};
