import { UserProfileService } from "../user-profile.service";

export const getUserProfileAction = (id: string) => UserProfileService.getById(id);
export const updateUserProfileAction = (id: string, data: any) => UserProfileService.update(id, data);