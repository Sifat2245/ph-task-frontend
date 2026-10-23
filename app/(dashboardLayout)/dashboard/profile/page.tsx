import { requireUser } from "@/lib/server/api";
import { MyProfile } from "@/components/people/my-profile";
export const metadata = { title: "My profile" };
export default async function ProfilePage() {
  await requireUser();
  return <MyProfile />;
}
