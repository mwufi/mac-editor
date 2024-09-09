import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAtom } from "jotai";
import { dialogOpenAtom } from "@/app/atoms";

export function DialogContents() {
	const [isOpen, setIsOpen] = useAtom(dialogOpenAtom);
	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent className="sm:max-w-3xl p-0 overflow-hidden bg-white dark:bg-dark-900">
				<div className="flex flex-col sm:flex-row">
					<div className="basis-[43%] sm:block w-full h-full">
						<div className="relative bg-light-200 bg-center bg-[url('https://cdn.midjourney.com/94b64486-2ee2-4ec9-9a79-d790f30aeb7f/0_0.png')] bg-cover w-full h-full absolute inset-0"></div>
					</div>
					<div className="flex-grow flex-shrink-0 basis-[55%] justify-center flex flex-col items-stretch p-8">
						<DialogHeader>
							<DialogTitle className="text-4xl tracking-[-4.3%] font-bold leading-[44px] pb-4">Explore the Frontiers of Imagination</DialogTitle>
							<DialogDescription>
								With the world's most advanced image models and regular updates with community steered roadmaps
							</DialogDescription>
						</DialogHeader>
						<div className="justify-center flex flex-col items-stretch">
							<h2 className="mt-8 text-lg font-semibold">Join our creative community</h2>
							<p>Hop in our <a href="/rooms" className="underline underline-offset-2">group creation rooms</a> or enjoy open access to billions of images and prompts with daily trends and real-time search</p>
							<h2 className="mt-8 text-lg font-semibold">Multiple tiers for everyone</h2>
							<p>Memberships start at $10/mo with a 20% discount on yearly plans</p>
							<div className="mt-8 flex flex-col items-stretch">
								<Button variant="default" className="w-full">Join now</Button>
								<Button variant="outline" className="mt-2 w-full">Look around a bit</Button>
							</div>
						</div>
					</div>
				</div>
				<div className="w-full bg-light-50 dark:bg-dark-850 py-4 text-sm text-center text-gray-500 dark:text-gray-400">
					Already have a subscription? <a href="/profile-settings" className="underline underline-offset-2 whitespace-nowrap">Link your accounts</a>
				</div>
			</DialogContent>
		</Dialog>
	)
}