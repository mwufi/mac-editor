import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";

// A full screen section. By default, the children are full height! this is great.
export const FullScreenSection = ({ children, className, peekNext = false }: { children?: React.ReactNode, className?: string, peekNext?: boolean }) => {
    return (
        <div className={`relative w-full ${peekNext ? "h-[95vh]" : "h-screen"} rounded-lg overflow-hidden ${className} grid w-full h-full`}>
            <div className="grid w-full h-full">
                {children}
            </div>
        </div>
    )
}

export const TwoColumnLayout = ({ children, className }: { children?: React.ReactNode, className?: string }) => {
    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 ${className}`}>
            {children}
        </div>
    )
}

const Hero = () => {
    return (
        <FullScreenSection>
            <Image
                src="https://www.decorilla.com/online-decorating/wp-content/uploads/2019/06/modern-interior-design-grey-living-room2-scaled.jpeg"
                alt="Contemporary interior design"
                layout="fill"
                objectFit="cover"
                className="brightness-75"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <h1 className="text-6xl font-bold text-white mb-auto mt-24">Contemporary</h1>
                <div className="mb-24 text-center">
                    <p className="text-white text-lg mb-4">Discover modern living spaces</p>
                    <Button variant="secondary" size="lg">
                        Explore Designs
                    </Button>
                </div>
            </div>
        </FullScreenSection>
    )
}

const profileInfo = {
    header: "Sammy",
    description: "designeverywhere:\nSusumu Yokota",
    avatar: "https://64.media.tumblr.com/e942f49fd5be28f0c38606bd48ab7704/ec2fc6e89aba2de6-6b/s128x128u_c1/cd3167d9ef392e4a10968a22c851e262abb8b14b.pnj",
    links: [
        { href: "/", text: "About", icon: "lnr-home" },
        { href: "#colors", text: "Get this theme", icon: "lnr-bubble" },
    ]
}

const testNotes = [
    {
        title: "Note 1",
        content: "This is the first note",
        noteImages: [
            "https://www.decorilla.com/online-decorating/wp-content/uploads/2019/06/modern-interior-design-grey-living-room2-scaled.jpeg",
            "https://www.decorilla.com/online-decorating/wp-content/uploads/2019/06/modern-interior-design-grey-living-room2-scaled.jpeg",
        ]
    },
    {
        title: "Note 2",
        content: "This is the second note",
        noteImages: [
            "https://www.decorilla.com/online-decorating/wp-content/uploads/2019/06/modern-interior-design-grey-living-room2-scaled.jpeg",
            "https://www.decorilla.com/online-decorating/wp-content/uploads/2019/06/modern-interior-design-grey-living-room2-scaled.jpeg",
        ]
    },
]

function Preview() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2">
            <ProfileAside />
            <div className="right-column">
                <ScrollArea className="h-[100vh]">
                    {testNotes.map((note) => (
                        <div key={note.title} className="mb-8">
                            <div className="mb-4">
                                {note.noteImages.map((image, index) => (
                                    <Image
                                        key={index}
                                        src={image}
                                        alt={`${note.title} - Image ${index + 1}`}
                                        width={1200}
                                        height={600}
                                        className="w-full h-auto mb-2"
                                    />
                                ))}
                            </div>
                            <h1 className="text-4xl font-serif mb-2">{note.title}</h1>
                            <p className="text-lg font-sans">{note.content}</p>
                        </div>
                    ))}
                </ScrollArea>

            </div>
        </div>
    )
}

function ProfileAside() {

    return (
        <aside className="bg-blue-100 headermenu">
            <p className="header">
                {profileInfo.header}
            </p>
            <div className="links">
                {profileInfo.links.map((link) => (
                    <Link href={link.href} key={link.href} className="link">
                        <span className={`lnr ${link.icon}`}></span>
                        {link.text}
                    </Link>
                ))}
            </div>
            <div className="description whitespace-pre-wrap">
                {profileInfo.description}
            </div>
            <div className="headerImg">
                <Image
                    src="https://64.media.tumblr.com/e942f49fd5be28f0c38606bd48ab7704/ec2fc6e89aba2de6-6b/s128x128u_c1/cd3167d9ef392e4a10968a22c851e262abb8b14b.pnj"
                    alt="Avatar"
                    width={128}
                    height={128}
                />
            </div>
        </aside>
    )
}

export default function Designer() {
    return (
        <>
            <FullScreenSection className="">
                <Preview />
            </FullScreenSection>
            <FullScreenSection className="p-4">
                <div className="grid place-items-center h-full bg-black text-white rounded-xl">hi</div>
            </FullScreenSection>

            <FullScreenSection className="p-4">
                <div className="grid place-items-center h-full bg-blue-400 text-white rounded-xl">welcome to the party</div>
            </FullScreenSection>


            <FullScreenSection className="p-4">
                <div className="grid place-items-center h-full bg-yellow-400 text-white rounded-xl">
                    <div>
                        <p>let&apos;s customize your homepage</p>
                        <Link href="#header">Header</Link>
                        <Link href="#colors">Colors</Link>
                        <Link href="#footer">Footer</Link>
                    </div>
                </div>
            </FullScreenSection>

            <FullScreenSection className="p-4">
                <TwoColumnLayout className="gap-4">
                    <div className="bg-red-400 p-6 rounded-xl">
                        <h1 className="text-4xl text-white" id="header">Design your header</h1>

                    </div>
                    <p className="text-lg">Welcome to the party</p>
                </TwoColumnLayout>
            </FullScreenSection>

            <FullScreenSection className="p-4">
                <TwoColumnLayout className="gap-4">
                    <div className="bg-gray-200 p-6 rounded-xl">
                        <h1 className="text-4xl" id="colors">Pick your colors</h1>

                    </div>
                    <p className="text-lg">Welcome to the party</p>
                </TwoColumnLayout>
            </FullScreenSection>
        </>
    )
}