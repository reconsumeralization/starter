import { relations } from "drizzle-orm/relations";
import { user, projects, projectMembers, imageFolders, images, imageRevisions, projectAuditLogs, projectEnvVars, projectIntegrations } from "./schema";

export const projectsRelations = relations(projects, ({one, many}) => ({
	user: one(user, {
		fields: [projects.userId],
		references: [user.id]
	}),
	projectMembers: many(projectMembers),
	imageFolders: many(imageFolders),
	projectAuditLogs: many(projectAuditLogs),
	projectEnvVars: many(projectEnvVars),
	projectIntegrations: many(projectIntegrations),
	images: many(images),
}));

export const userRelations = relations(user, ({many}) => ({
	projects: many(projects),
	projectMembers: many(projectMembers),
	imageRevisions: many(imageRevisions),
	projectAuditLogs: many(projectAuditLogs),
	images: many(images),
}));

export const projectMembersRelations = relations(projectMembers, ({one}) => ({
	project: one(projects, {
		fields: [projectMembers.projectId],
		references: [projects.id]
	}),
	user: one(user, {
		fields: [projectMembers.userId],
		references: [user.id]
	}),
}));

export const imageFoldersRelations = relations(imageFolders, ({one, many}) => ({
	project: one(projects, {
		fields: [imageFolders.projectId],
		references: [projects.id]
	}),
	images: many(images),
}));

export const imageRevisionsRelations = relations(imageRevisions, ({one}) => ({
	image: one(images, {
		fields: [imageRevisions.imageId],
		references: [images.id]
	}),
	user: one(user, {
		fields: [imageRevisions.userId],
		references: [user.id]
	}),
}));

export const imagesRelations = relations(images, ({one, many}) => ({
	imageRevisions: many(imageRevisions),
	project: one(projects, {
		fields: [images.projectId],
		references: [projects.id]
	}),
	imageFolder: one(imageFolders, {
		fields: [images.folderId],
		references: [imageFolders.id]
	}),
	user: one(user, {
		fields: [images.userId],
		references: [user.id]
	}),
}));

export const projectAuditLogsRelations = relations(projectAuditLogs, ({one}) => ({
	project: one(projects, {
		fields: [projectAuditLogs.projectId],
		references: [projects.id]
	}),
	user: one(user, {
		fields: [projectAuditLogs.actorId],
		references: [user.id]
	}),
}));

export const projectEnvVarsRelations = relations(projectEnvVars, ({one}) => ({
	project: one(projects, {
		fields: [projectEnvVars.projectId],
		references: [projects.id]
	}),
}));

export const projectIntegrationsRelations = relations(projectIntegrations, ({one}) => ({
	project: one(projects, {
		fields: [projectIntegrations.projectId],
		references: [projects.id]
	}),
}));