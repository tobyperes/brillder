import {get, put, post, postRes} from './index';

import { UserPreferenceType, User } from 'model/user';
import { UpdateUserStatus } from 'components/userProfilePage/model';
import { Editor } from 'model/brick';

const profileErrorHandler = (e: any) => {
  const {response} = e;
  if (response.status === 405) {
    if (response.data === 'User with that email already exists.') {
      return UpdateUserStatus.InvalidEmail;
    }
  }
  return UpdateUserStatus.Failed;
}

export const createUser = async (userToSave: any) => {
  try {
    const data = await post<string>('/user/new', { ...userToSave });
    return data === 'OK' ? UpdateUserStatus.Success : UpdateUserStatus.Failed;
  } catch (e) {
    return profileErrorHandler(e);
  }
}

export const updateUser = async (userToSave: any) => {
  try {
    const data = await put<string>('/user', { ...userToSave });
    return data === 'OK' ? true : false;
  } catch {
    return false;
  }
}

export const suggestUsername = async (name: string) => {
  try {
    return await get<User[]>(`/user/suggest/${name}`);
  } catch {
    return null;
  }
}

export const getUserById = async (userId: number) => {
  try {
    return await get<User>(`/user/${userId}`);
  } catch {
    return null;
  }
}

export const saveProfileImageName = async (userId: number, name: string, profilePublic: boolean) => {
  try {
    const data = await put<string>(`/user/profileImage/${userId}/${name}/${profilePublic}`, {});
    return data === "OK" ? true : false;
  } catch {
    return false;
  }
}

export const getUserByUserName = async (userName: string) => {
  try {
    let user = await get<Editor>(`/user/byUsername/${userName}`);
    return {
      success: true,
      user
    }
  } catch (e) {
    return {
      success: false,
      message: e.response.data
    }
  }
}

export const setUserPreference = async (preferenceId: UserPreferenceType, initial?: boolean) => {
  try {

    var url = initial
      ? `/user/rolePreference/${preferenceId}/true`
      :`/user/rolePreference/${preferenceId}`

    const data = await put<any>(url, {});

    return data === "OK" ? true : false;
  } catch (e) {
    return false;
  }
}

export const setUserPreferenceTypeById = async (preferenceId: UserPreferenceType, userId: number) => {
  try {

    var url = `/user/rolePreferenceById/${preferenceId}/${userId}`;

    const data = await put<any>(url, {userId});

    return data === "OK" ? true : false;
  } catch (e) {
    return false;
  }
}

export interface CreateByEmailRes {
  user: User;
  token: string;
  errors: any[];
}

/**
 * This backend call is weard return different stuff
 * When invalid sometimes return status 400 sometimes 200 with errors array in body.
 * @param email string
 */
export const createUserByEmail = async(email: string) => {
  try {
    const res = await postRes('/auth/createUser/', { email });
    if (res.data && res.data.errors) {
      return null;
    }
    return res.data as CreateByEmailRes;
  } catch (e) {
    if (e && e.response && e.response.status === 400) {
      return 400;
    }
    return null;
  }
}

/**
 * Accept terms and conditions
 */
export const acceptTerms = async(termsAndConditionsAcceptedVersion: string) => {
  try {
    const data = await post<string>('/user/termsAndConditions', { termsAndConditionsAcceptedVersion });
    if (data === "OK") {
      return true;
    }
    return false;
  } catch (e) {
    return null;
  }
}

/**
 * Assign new subject to current user
 */
export const addSubject = async(subjectId: number) => {
  try {
    const data = await put<string>('/user/addSubject/' + subjectId, {});
    if (data === "OK") {
      return true;
    }
    return false;
  } catch (e) {
    return null;
  }
}
