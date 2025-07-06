export const toUserResponse = (user: IUser): IUserResponse => {
  const { _id, email, username, role, status, createdAt, updatedAt } = user

  return { userId: _id.toString(), email, username, role, status, createdAt, updatedAt }
}

export const toUserResponseList = (users: IUser[]): IUserResponse[] => {
  return users.map(toUserResponse)
}
