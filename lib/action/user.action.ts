"use server";
import User from '../modules/user.module'
import db  from "../db";

export async function createUser(user: any) {
  try {
    await db();
    const newUser = await User.create(user);
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    console.log(error);
  }
}