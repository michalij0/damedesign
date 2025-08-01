import Image from "next/image";

const logos = [
  { name: "gugu", src: "/img/gugu.png" },
  { name: "kick", src: "/img/kick.png" },
  { name: "merchismire", src: "/img/merchismire.png" },
  { name: "not", src: "/img/not.png" },
  { name: "phhf", src: "/img/phhf.png" },
  { name: "yello", src: "/img/yello.png" },
];

export default function LogoCarousel() {
  return (
    <div
      className="group w-full inline-flex flex-nowrap overflow-hidden py-12 [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]"
    >
      <ul className="flex items-center justify-center animate-infinite-scroll group-hover:[animation-play-state:paused] md:justify-start">
        {/* Renderujemy loga po raz pierwszy */}
        {logos.map((logo) => (
          <li key={logo.name} className="mx-12 flex-shrink-0">
            <Image
              src={logo.src}
              alt={logo.name}
              width={140}
              height={50}
              className="h-12 w-auto object-contain filter grayscale brightness-50 opacity-60 transition-all duration-300 hover:grayscale-0 hover:brightness-100 hover:opacity-100"
            />
          </li>
        ))}
        {/* Renderujemy loga po raz drugi, aby stworzyć płynną pętlę */}
        {logos.map((logo) => (
          <li
            key={`${logo.name}-duplicate`}
            className="mx-12 flex-shrink-0"
            aria-hidden="true"
          >
            <Image
              src={logo.src}
              alt={logo.name}
              width={140}
              height={50}
              className="h-12 w-auto object-contain filter grayscale brightness-50 opacity-60 transition-all duration-300 hover:grayscale-0 hover:brightness-100 hover:opacity-100"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
