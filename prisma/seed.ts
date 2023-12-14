import { PermissionName, ProjectRoleName } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const rolePermissionsMapping = {
  Owner: [
    PermissionName.AddRemoveAdmins,
    PermissionName.AddRemoveNonAdmin,
    PermissionName.EditProjectInfo,
    PermissionName.DeleteAllTracksAndFiles,
    PermissionName.AddTracks,
    PermissionName.AddFiles,
    PermissionName.DeleteFilesMade,
    PermissionName.InviteGuests,
    PermissionName.ViewProjectTracksAndFiles,
    PermissionName.AddComments,
    PermissionName.DeleteComments,
    PermissionName.DeleteProjects,
  ],
  Admin: [
    PermissionName.AddRemoveNonAdmin,
    PermissionName.EditProjectInfo,
    PermissionName.DeleteAllTracksAndFiles,
    PermissionName.AddTracks,
    PermissionName.AddFiles,
    PermissionName.DeleteFilesMade,
    PermissionName.InviteGuests,
    PermissionName.ViewProjectTracksAndFiles,
    PermissionName.AddComments,
    PermissionName.DeleteComments,
  ],
  Collaborator: [
    PermissionName.AddTracks,
    PermissionName.AddFiles,
    PermissionName.DeleteFilesMade,
    PermissionName.InviteGuests,
    PermissionName.ViewProjectTracksAndFiles,
    PermissionName.AddComments,
  ],
  Listener: [
    PermissionName.ViewProjectTracksAndFiles,
    PermissionName.AddComments,
  ],
};

async function assignRolePermissions() {
  const rolePermissionsMap = Object.entries(rolePermissionsMapping) as [
    ProjectRoleName,
    PermissionName[],
  ][];
  for (const [role, permissions] of rolePermissionsMap) {
    // Get or create the role
    const roleRecord =
      (await prisma.projectRole.findFirst({
        where: { name: role },
      })) ||
      (await prisma.projectRole.create({
        data: { name: role },
      }));

    // Iterate through permissions for each role
    for (const permissionName of permissions) {
      // Get or create the permission
      const permissionRecord =
        (await prisma.permission.findFirst({
          where: { name: permissionName },
        })) ||
        (await prisma.permission.create({
          data: { name: permissionName },
        }));

      // Use upsert to create or update the role-permission mapping
      await prisma.projectRolePermissions.upsert({
        where: {
          roleId_permissionId: {
            roleId: roleRecord.id,
            permissionId: permissionRecord.id,
          },
        },
        update: {},
        create: {
          roleId: roleRecord.id,
          permissionId: permissionRecord.id,
        },
      });
    }
  }
}

async function main() {
  const permissions = Object.keys(PermissionName) as PermissionName[];
  for (const permission of permissions) {
    const permissionRecord =
      (await prisma.permission.findFirst({
        where: {
          name: permission,
        },
      })) ||
      (await prisma.permission.create({
        data: { name: permission },
      }));
    await prisma.permission.upsert({
      where: {
        id: permissionRecord?.id,
      },
      create: {
        name: permission,
      },
      update: {},
    });
  }

  const projectRoles = Object.keys(ProjectRoleName) as ProjectRoleName[];
  for (const role of projectRoles) {
    const roleRecord =
      (await prisma.projectRole.findFirst({
        where: {
          name: role,
        },
      })) ||
      (await prisma.projectRole.create({
        data: { name: role },
      }));
    await prisma.projectRole.upsert({
      where: {
        id: roleRecord?.id,
      },
      create: {
        name: role,
      },
      update: {},
    });
  }

  assignRolePermissions()
    .then(() => console.log("Role permissions assigned"))
    .catch((error) => {
      console.error("Error assigning role permissions", error);
    });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
