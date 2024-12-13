import { useUser } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import PostHomePage from "../components/PostHomePage";
import SearchHomePage from "../components/SearchHomePage";
import AfterLoginHandler from "@/components/AfterLoginHandler";

export default async function Home() {
  // const { isLoaded, isSignedIn, user } = useUser();
  const user = await currentUser();
  console.log(user);
  console.log(process.env.MONGODB_URL);
  console.log(process.env.WEBHOOKS_SECRET);
  return (
    <>
      <AfterLoginHandler />
      <p id="lorem-become-bloger">
        Become as Bloger <button>Apply</button>
      </p>
      <div className="home-page">
        <PostHomePage />
        <SearchHomePage />
      </div>
    </>
  );
}
