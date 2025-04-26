import { pgTable, uniqueIndex, foreignKey, unique, uuid, text, jsonb, timestamp, varchar, serial, integer, primaryKey, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const integrationProvider = pgEnum("integration_provider", ['github', 'gitlab', 'vercel'])
export const integrationStatus = pgEnum("integration_status", ['active', 'inactive', 'error'])
export const messageSender = pgEnum("message_sender", ['user', 'assistant'])
export const projectMemberRole = pgEnum("project_member_role", ['owner', 'admin', 'member', 'viewer'])
export const projectVisibility = pgEnum("project_visibility", ['public', 'private'])


export const projects = pgTable("projects", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	name: text().notNull(),
	description: text(),
	slug: text().notNull(),
	visibility: projectVisibility().default('private'),
	avatarUrl: text("avatar_url").default('/avatars/placeholder.png'),
	metadata: jsonb(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	archivedAt: timestamp("archived_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	uniqueIndex("projects_slug_unique_idx").using("btree", table.slug.asc().nullsLast().op("text_ops")),
	uniqueIndex("projects_user_id_name_unique_idx").using("btree", table.userId.asc().nullsLast().op("text_ops"), table.name.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "projects_user_id_user_id_fk"
		}).onDelete("cascade"),
	unique("projects_slug_unique").on(table.slug),
]);

export const user = pgTable("user", {
	id: text().primaryKey().notNull(),
	email: varchar({ length: 256 }).notNull(),
	name: text(),
	image: text(),
	emailVerified: timestamp({ mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("user_email_unique").on(table.email),
]);

export const projectMembers = pgTable("project_members", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	projectId: uuid("project_id").notNull(),
	userId: text("user_id").notNull(),
	role: projectMemberRole().default('member').notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.projectId],
			foreignColumns: [projects.id],
			name: "project_members_project_id_projects_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "project_members_user_id_user_id_fk"
		}).onDelete("cascade"),
]);

export const session = pgTable("session", {
	sessionToken: text().primaryKey().notNull(),
	userId: text().notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
});

export const grokMessages = pgTable("grok_messages", {
	id: serial().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	role: varchar({ length: 16 }).notNull(),
	content: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const chatMessages = pgTable("chat_messages", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	sessionId: uuid("session_id").notNull(),
	sender: messageSender().notNull(),
	content: text().notNull(),
	tokens: jsonb(),
	metadata: jsonb(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const chatSessions = pgTable("chat_sessions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	projectId: uuid("project_id"),
	title: varchar({ length: 256 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	metadata: jsonb(),
});

export const imageFolders = pgTable("image_folders", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	projectId: uuid("project_id").notNull(),
	name: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.projectId],
			foreignColumns: [projects.id],
			name: "image_folders_project_id_projects_id_fk"
		}).onDelete("cascade"),
]);

export const imageRevisions = pgTable("image_revisions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	imageId: uuid("image_id").notNull(),
	userId: text("user_id").notNull(),
	diffUrl: text("diff_url"),
	note: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.imageId],
			foreignColumns: [images.id],
			name: "image_revisions_image_id_images_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "image_revisions_user_id_user_id_fk"
		}).onDelete("cascade"),
]);

export const projectAuditLogs = pgTable("project_audit_logs", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	projectId: uuid("project_id").notNull(),
	actorId: text("actor_id"),
	action: text().notNull(),
	diff: jsonb(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.projectId],
			foreignColumns: [projects.id],
			name: "project_audit_logs_project_id_projects_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.actorId],
			foreignColumns: [user.id],
			name: "project_audit_logs_actor_id_user_id_fk"
		}).onDelete("set null"),
]);

export const projectEnvVars = pgTable("project_env_vars", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	projectId: uuid("project_id").notNull(),
	key: text().notNull(),
	encryptedValue: text("encrypted_value").notNull(),
	version: uuid().defaultRandom().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.projectId],
			foreignColumns: [projects.id],
			name: "project_env_vars_project_id_projects_id_fk"
		}).onDelete("cascade"),
]);

export const projectIntegrations = pgTable("project_integrations", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	projectId: uuid("project_id").notNull(),
	provider: integrationProvider().notNull(),
	status: integrationStatus().default('inactive').notNull(),
	secretRef: text("secret_ref"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.projectId],
			foreignColumns: [projects.id],
			name: "project_integrations_project_id_projects_id_fk"
		}).onDelete("cascade"),
]);

export const images = pgTable("images", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	projectId: uuid("project_id").notNull(),
	folderId: uuid("folder_id"),
	userId: text("user_id").notNull(),
	title: text(),
	originalUrl: text("original_url"),
	thumbUrl: text("thumb_url"),
	width: integer(),
	height: integer(),
	mimeType: text("mime_type"),
	metadata: jsonb(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.projectId],
			foreignColumns: [projects.id],
			name: "images_project_id_projects_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.folderId],
			foreignColumns: [imageFolders.id],
			name: "images_folder_id_image_folders_id_fk"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "images_user_id_user_id_fk"
		}).onDelete("cascade"),
]);

export const verificationToken = pgTable("verification_token", {
	identifier: text().notNull(),
	token: text().notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	primaryKey({ columns: [table.identifier, table.token], name: "verification_token_identifier_token_pk"}),
]);

export const authenticator = pgTable("authenticator", {
	credentialId: text().notNull(),
	userId: text().notNull(),
	providerAccountId: text().notNull(),
	credentialPublicKey: text().notNull(),
	counter: integer().notNull(),
	credentialDeviceType: text().notNull(),
	credentialBackedUp: serial().notNull(),
	transports: text(),
}, (table) => [
	primaryKey({ columns: [table.credentialId, table.userId], name: "authenticator_userId_credentialID_pk"}),
	unique("authenticator_credentialID_unique").on(table.credentialId),
]);

export const account = pgTable("account", {
	userId: text().notNull(),
	type: text().notNull(),
	provider: text().notNull(),
	providerAccountId: text().notNull(),
	refreshToken: text("refresh_token"),
	accessToken: text("access_token"),
	expiresAt: integer("expires_at"),
	tokenType: text("token_type"),
	scope: text(),
	idToken: text("id_token"),
	sessionState: text("session_state"),
}, (table) => [
	primaryKey({ columns: [table.provider, table.providerAccountId], name: "account_provider_providerAccountId_pk"}),
]);
