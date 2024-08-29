import { router } from 'expo-router';
import { Client, Account, ID, Avatars, Databases, Query } from 'react-native-appwrite';

export const appwriteConfig = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: "com.kusal.aora",
    projectId: "66cefcaf00104d425b11",
   storageId: "66cf0385001e1a2f07c7",
    databaseId: "66ceff6100222fb45156",
    userCollectionId: "66ceffa200171d952fd8",
    videoCollectionId: "66cf00b00001d2217082",
  };


// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
    .setProject(appwriteConfig.projectId) // Your project ID
    .setPlatform(appwriteConfig.platform) // Your application ID or bundle ID.
;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
// Register User


export async function createUser(email, password, username) {
    try {
      const newAccount = await account.create(
        ID.unique(),
        email,
        password,
        username
      );
  
      if (!newAccount) throw Error;
  
      const avatarUrl = avatars.getInitials(username);
  
     // await signIn(email, password);
  router.push('/sign-in')
      const newUser = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        ID.unique(),
        {
          accountid: newAccount.$id,
          email: email,
          username: username,
          avatar: avatarUrl,
        }
      );
  
      return newUser;
    } catch (error) {
      throw new Error(error);
    }
  }
  
  // Sign In
  export async function signIn(email, password) {
    try {
      const session = await account.createEmailPasswordSession(email, password);
  
      return session;
    } catch (error) {
      throw new Error(error);
    }
  }

  export const getCurrentUser=async()=>{
    try {
        const currentAccount=await account.get()
        if(!currentAccount){
    throw   Error
        }
        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("accountid", currentAccount.$id)]
          );
      
          if (!currentUser) throw Error;
      
          return currentUser.documents[0];
    } catch (error) {
        
    }
  }

  export const getAllPosts=async()=>{
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId
          );
      
          return posts.documents;
        
    } catch (error) {
        throw new Error(error)
    }
  }

  export const getLatestPosts=async()=>{
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            [Query.orderDesc('$createdAt',Query.limit(7))]
          );
      
          return posts.documents;
        
    } catch (error) {
        throw new Error(error)
    }
  }