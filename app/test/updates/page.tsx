import React from 'react';

// Components
const Timeline = ({ children }) => (
  <div className="flex flex-col max-md:gap-12">
    {children}
  </div>
);

const TimelineDate = ({ date, time }) => (
  <dl className="flex justify-between items-baseline left-0 top-0 lg:left-auto lg:right-full md:w-1/4 shrink-0">
    <div className="sticky top-4 md:pb-16 flex max-md:justify-between w-full md:flex-col max-md:items-baseline">
      <div className="sr-only">Date</div>
      <div className="flex gap-2 items-center font-medium text-base mb-0.5 min-w-max md:leading-[45px]">
        <time dateTime={date}>{date}</time>
      </div>
      <div className="hidden md:flex mr-auto ml-2 md:!mx-0 gap-2 text-xs items-baseline -mt-2.5">{time}</div>
    </div>
  </dl>
);

const Tag = ({ type, icon }) => (
  <span className="flex items-center gap-1 tracking-wide pr-3 py-1 text-splash border-splash/10 max-w-fit rounded-full text-xs first-letter:uppercase" style={{ filter: "hue-rotate(90deg)" }}>
    {icon}
    {type}
  </span>
);

const Article = ({ title, content, images }) => (
  <div className="relative md:pb-16 group-last-of-type:pb-0 md:px-4 flex flex-col gap-4 max-w-[40rem] w-full">
    <div className="flex relative flex-col">
      <h3 className="font-semibold text-3xl">{title}</h3>
    </div>
    <div className="mt-2 relative md:mb-4 prose prose-sm prose-light prose-a:relative prose-a:z-10 dark:prose-dark prose-a:underline prose-a:text-splash prose-a:underline-offset-4 prose-code:bg-light-50 dark:prose-code:bg-dark-800 dark:prose-code:border-dark-750 prose-code:rounded-md prose-code:px-1.5 prose-code:mx-0.5 prose-code:border prose-code:py-0.5 prose-code:font-normal dark:prose-invert prose-code:before:hidden prose-code:after:hidden prose-strong:pt-3 prose-img:object-cover prose-img:object-center prose-img:rounded-lg prose-img:bg-light-skeleton prose-img:dark:bg-dark-skeleton">
      {content}
      {images && images.map((img, index) => (
        <img key={index} src={img.src} alt={img.alt} className="kg-image" />
      ))}
    </div>
  </div>
);

const Title = ({ children }) => (
  <h1 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl" role="heading">{children}</h1>
);

const NavLink = ({ href, children }) => (
  <a href={href} className="flex min-w-max flex-center font-medium text-sm gap-1 opacity-100">{children}</a>
);

export default function UpdatesPage() {
  return (
    <div className="h-[100vh] relative max-sm:pb-20 w-full overflow-y-scroll">
      <div className="mx-auto pb-12 px-4 xs:px-8 sm:px-12 lg:px-6 max-w-5xl pt-12 gap-14 md:gap-24 flex flex-col justify-start w-full min-h-[101vh]">
        <div className="flex flex-col text-center gap-4">
          <Title>Latest Updates</Title>
        </div>
        <div className="flex md:justify-center md:relative md:h-5 w-full items-center max-md:overflow-x-scroll microScrollbar">
          <div className="flex gap-4 mx-auto">
            <NavLink href="#">All</NavLink>
            <NavLink href="#">Announcements</NavLink>
            <NavLink href="#">Office Hours</NavLink>
            <NavLink href="#">Changelog</NavLink>
          </div>
        </div>
        <Timeline>
          {/* Example usage of components */}
          <div className="relative group flex flex-col md:flex-row gap-4 md:gap-8 max-md:!mt-0" style={{ marginTop: "-19px" }}>
            <TimelineDate date="September 06, 2024" time="6:46 PM" />
            <Article
              title="Personalization for Niji"
              content={<p>Hi everyone, personalization for the Niji (anime) model is available today!</p>}
              images={[{ src: "https://updates.midjourney.com/content/images/2024/09/image.png", alt: "" }]}
            />
          </div>
          <div className="relative group flex flex-col md:flex-row gap-4 md:gap-8 max-md:!mt-0" style={{ marginTop: "-19px" }}>
            <TimelineDate date="September 06, 2024" time="6:46 PM" />
            <Article
              title="Personalization for Niji"
              content={<p>Hi everyone, personalization for the Niji (anime) model is available today!</p>}
              images={[{ src: "https://updates.midjourney.com/content/images/2024/09/image.png", alt: "" }]}
            />
          </div>
          <div className="relative group flex flex-col md:flex-row gap-4 md:gap-8 max-md:!mt-0" style={{ marginTop: "-19px" }}>
            <TimelineDate date="September 06, 2024" time="6:46 PM" />
            <Article
              title="Personalization for Niji"
              content={<p>Hi everyone, personalization for the Niji (anime) model is available today!</p>}
              images={[{ src: "https://updates.midjourney.com/content/images/2024/09/image.png", alt: "" }]}
            />
          </div>
          {/* Add more timeline items as needed */}
          <div className="relative group flex flex-col md:flex-row gap-4 md:gap-8 max-md:!mt-0" style={{ marginTop: "-10px" }}>
            <TimelineDate date="June 19, 2024" time="12:44 AM" />
            <Article
              title="Web Updates"
              content={
                <>
                  <p>We've got a list of assorted changes and improvements going live today:</p>
                  <p><strong>Creation:</strong></p>
                  <ul>
                    <li>Fixed and improved feedback when uploading images into the imagine and chat inputs.</li>
                    <li>Dragging images into the imagine bar now works properly on Firefox.</li>
                    <li>Notification appears on the create tab when creating an image from the lightbox with an action button.</li>
                    <li>Improved error design and messaging in creation.</li>
                    <li>Fixed issue where Basic Plan users could select `Relax` mode, causing an error on every creation.</li>
                  </ul>
                  <p><strong>Help:</strong></p>
                  <ul>
                    <li>We're tying together the various help resources into a single <a href="https://www.midjourney.com/help?ref=updates.midjourney.com" rel="noreferrer">/help</a> page, which adds a help chat w/ bot. We'll continue evolving this page over time to help new and experienced users alike.</li>
                    <li>Loading the system status report is now significantly faster.</li>
                    <li>Bug reports are now sent to a dedicated QA team for review.</li>
                  </ul>
                  <p><strong>Rooms:</strong></p>
                  <ul>
                    <li>Rooms are now publicly visible to anyone with an account, though only those with web creation access can participate.</li>
                    <li>Opening large rooms from the lobby should be much faster.</li>
                    <li>There are new default rooms for Prompt Craft, Newbies, and Help to help users learn.</li>
                  </ul>
                  <p><strong>General:</strong></p>
                  <ul>
                    <li>Option to follow your system's light/dark mode preference.</li>
                    <li>Many small stability fixes.</li>
                  </ul>
                </>
              }
              tag="Change Log"
            />
          </div>
        </Timeline>
      </div>
    </div>
  );
}