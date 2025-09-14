import { auth } from "@/aspects/auth";
import { Vision } from "@/aspects/vision/Vision";
import { headers } from "next/headers";

export default async function Home() {
  const h = await headers();
  const sessionRes = (await auth().api.getSession({ headers: h })) as any;
  const loggedIn = !!(sessionRes?.user?.id ?? sessionRes?.data?.user?.id);

  return (
    <main>
      <Vision loggedIn={loggedIn} />
    </main>
  );
}
