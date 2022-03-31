import { NextPage, GetStaticProps } from "next";
import { RegistrationData } from "components/onboarding/form";
import { Field } from "lib/skills";
import OnboardingPage from "components/onboarding/page";
import { siteData } from "lib/site-data";

type PageProps = {
  skills: readonly Field[];
};

const Page: NextPage<PageProps> = ({ skills }) => {
  return <OnboardingPage skills={skills} onSubmit={submitRegistrationData} />;
};

async function submitRegistrationData(
  data: RegistrationData
): Promise<boolean> {
  try {
    const response = await fetch("/api/registrations", {
      method: "post",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
    return response.ok;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const { skills } = siteData;
  return {
    props: { skills },
  };
};

export default Page;
