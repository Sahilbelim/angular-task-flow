export function hasPermission(
    permissions: string[],
    userId: string
): boolean {
    return permissions.includes(userId);
}
