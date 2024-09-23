import BackButton from "../BackButton";

const Header = () => {
  return (
    <div data-tauri-drag-region className="w-full h-12 bg-gray-200 flex items-center justify-center">
      <h1 className="text-lg font-semibold">Header Bar</h1>
    </div>
  );
};
const Footer = () => {
  return (
    <div className="w-full h-12 mt-20 bg-gray-50 flex items-center justify-center">
      <h1 className="text-lg font-semibold">Footer Bar</h1>
    </div>
  );
};
export default function TestPreviewPage() {
  return (
    <div className="flex flex-col h-full w-full">
      <Header />
      <div className="flex-1 w-full bg-white p-8 overflow-y-auto flex justify-center">
        <div className="max-w-prose">
          <BackButton />
          <h2 className="text-3xl font-bold mb-2">Blog Title</h2>
          <div className="text-sm text-gray-500 mb-4">
            <span>By Author Name</span> | <span>Date</span> | <span>Tags: #tag1, #tag2</span>
          </div>
          <div className="mb-4">
            <img src="https://via.placeholder.com/800x400" alt="Blog Post Image" className="w-full h-auto rounded-lg shadow-md" />
          </div>
          <p className="text-base leading-relaxed mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam scelerisque leo nec
            libero fermentum, a tincidunt nisi facilisis. Integer nec odio nec urna fermentum
            tincidunt. Sed sit amet eros a libero tincidunt tincidunt. Curabitur at libero
            vehicula, tincidunt libero a, tincidunt libero. Donec sit amet libero nec libero
            tincidunt tincidunt. Nullam scelerisque leo nec libero fermentum, a tincidunt nisi
            facilisis. Integer nec odio nec urna fermentum tincidunt. Sed sit amet eros a libero
            tincidunt tincidunt. Curabitur at libero vehicula, tincidunt libero a, tincidunt
            libero. Donec sit amet libero nec libero tincidunt tincidunt.
          </p>
          <div className="mb-4">
            <img src="https://via.placeholder.com/800x400" alt="Blog Post Image" className="w-full h-auto rounded-lg shadow-md" />
          </div>
          <p className="text-base leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam scelerisque leo nec
            libero fermentum, a tincidunt nisi facilisis. Integer nec odio nec urna fermentum
            tincidunt. Sed sit amet eros a libero tincidunt tincidunt. Curabitur at libero
            vehicula, tincidunt libero a, tincidunt libero. Donec sit amet libero nec libero
            tincidunt tincidunt. Nullam scelerisque leo nec libero fermentum, a tincidunt nisi
            facilisis. Integer nec odio nec urna fermentum tincidunt. Sed sit amet eros a libero
            tincidunt tincidunt. Curabitur at libero vehicula, tincidunt libero a, tincidunt
            libero. Donec sit amet libero nec libero tincidunt tincidunt.
          </p>
          <Footer />
        </div>
      </div>
    </div>
  );
}