export const toUserResponse = (user: IUser): IUserResponse => {
  const { _id, email, username, role, status } = user
  return { userId: _id.toString(), email, username, role, status }
}

export const toUserResponseList = (users: IUser[]): IUserResponse[] => {
  return users.map(toUserResponse)
}
