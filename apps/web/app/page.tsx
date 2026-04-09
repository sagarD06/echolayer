import Image from "next/image";

export default function Home() {
  return (
    <div className="text-2xl bg-background text-primary">
      Hello EchoLayer!
      <Image src="/EchoLayer.svg" alt="logo" width={220} height={90}/>
    </div>
  );
}
