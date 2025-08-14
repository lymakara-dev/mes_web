import { Card, CardHeader, CardBody, Image, CardFooter } from "@heroui/react";
import { BookOpenIcon } from "@heroicons/react/24/outline";

type MyCardProps = {
  image: string;
  title: string;
  subjects: number;
};

export default function MyCard({ image, title, subjects }: MyCardProps) {
  return (
    <Card className="py-4 bg-white dark:bg-gray-800 transition-colors">
      <CardHeader className="overflow-visible py-2 flex justify-center">
        <Image
          alt="Card background"
          className="object-cover rounded-xl"
          src={image}
          width={270}
        />
      </CardHeader>
      <CardBody className="pb-0 pt-2 px-4 flex-col items-start">
        <h4 className="font-bold text-large text-gray-900 dark:text-gray-100">
          {title}
        </h4>
      </CardBody>
      <CardFooter className="flex gap-2 text-gray-500 dark:text-gray-400">
        <BookOpenIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
        <small>{subjects} មុខវិជ្ជា</small>
      </CardFooter>
    </Card>
  );
}
