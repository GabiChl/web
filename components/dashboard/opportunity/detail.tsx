import { PortalOpportunity, PortalProject, PortalUser } from "lib/portal-types";
import { Layout, Section, SectionContent } from "components/layout";
import { Heading1, Body } from "components/typography";
import * as S from "components/dashboard/opportunity/styles";
import { TimeIcon } from "components/shared/icons";
import OpportunityItem from "components/sections/opportunity-overview";
import OwnerContact from "components/dashboard/opportunity";
import { OpportunitiesMainWrapper } from "components/dashboard/styles";
import { getResizedImgUrl } from "lib/utils";
import RenderMarkdown from "components/shared/markdown";
import { Route } from "lib/routing";
import strings from "content/strings.json";
import Link from "next/link";

export type PageProps = {
  opportunity: PortalOpportunity;
  opportunities: readonly PortalOpportunity[];
  users: readonly PortalUser[];
  projects: readonly PortalProject[];
};

export const OpportunityDetailPage: React.FC<PageProps> = (props) => {
  const { opportunity, opportunities, users, projects } = props;
  const opportunityProject = (o: PortalOpportunity) =>
    projects.find((p) => p.id === o.projectId)!;
  const opportunityOwner = (o: PortalOpportunity) =>
    users.find((u) => u.id === o.ownerId)!;
  const otherOpportunities = opportunities.filter(
    (o) => o.id !== opportunity.id
  );
  const parentProject = opportunityProject(opportunity);
  const owner = opportunityOwner(opportunity);
  const coverImageUrl =
    opportunity.coverImageUrl || parentProject.coverImageUrl;
  return (
    <Layout
      crumbs={[
        { path: Route.dashboard, label: strings.crumbs.dashboard },
        { path: Route.opportunities, label: "Volné pozice" },
        { label: opportunity.name },
      ]}
      head={{
        title: opportunity.name,
        description: opportunity.summary.source, // TODO: We should have a plain text summary and a Markdown description
        coverUrl: coverImageUrl,
      }}
    >
      <Section>
        <SectionContent>
          <Heading1>{opportunity.name}</Heading1>
          <S.CoverImageWrapper>
            <S.CoverImage
              src={getResizedImgUrl(coverImageUrl, 1160)}
              loading="lazy"
            />
          </S.CoverImageWrapper>
          <S.OpportunityHeader>
            <S.OpportunityDescription>
              <Body>
                <RenderMarkdown source={opportunity.summary} />
              </Body>
            </S.OpportunityDescription>
            <S.OpportunityContactCard>
              <S.OpportunityMetaRow>
                <S.OpportunityProjectImg src={parentProject.logoUrl} />
                {parentProject.state === "draft" ||
                  (parentProject.state === "internal" && (
                    <Body>{parentProject.name}</Body>
                  ))}
                {parentProject.state !== "draft" &&
                  parentProject.state !== "internal" && (
                    <Link href={Route.toProject(parentProject)}>
                      <a>
                        <Body>{parentProject.name}</Body>
                      </a>
                    </Link>
                  )}
              </S.OpportunityMetaRow>
              <S.OpportunityMetaRow>
                <TimeIcon />
                <Body>{opportunity.timeRequirements}</Body>
              </S.OpportunityMetaRow>
              <S.OpportunityOwnerWrapper>
                <Body>Kontaktní osoba</Body>
                <S.OwnerWrapper>
                  <S.OwnerImage src={owner.profilePictureUrl} />
                  <OwnerContact email={owner.email} name={owner.name} />
                </S.OwnerWrapper>
              </S.OpportunityOwnerWrapper>
              <a href={opportunity.contactUrl} target="blank">
                <S.OpportunitySlackButton>
                  Kontaktovat přes Slack
                </S.OpportunitySlackButton>
              </a>
            </S.OpportunityContactCard>
          </S.OpportunityHeader>
        </SectionContent>
      </Section>
      <Section>
        <SectionContent>
          <OpportunitiesMainWrapper>
            {otherOpportunities.slice(0, 3).map((o) => (
              <OpportunityItem
                key={o.id}
                opportunity={o}
                relatedProject={opportunityProject(o)}
              />
            ))}
          </OpportunitiesMainWrapper>
        </SectionContent>
      </Section>
    </Layout>
  );
};
