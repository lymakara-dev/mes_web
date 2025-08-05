# Mock Exam System

This project is built on top of HeroUI template which aims to help highschool student to get prepare for their university entrance exam.


## Technologies Used

- [Next.js 14](https://nextjs.org/docs/getting-started)
- [HeroUI v2](https://heroui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Tailwind Variants](https://tailwind-variants.org)
- [TypeScript](https://www.typescriptlang.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [next-themes](https://github.com/pacocoursey/next-themes)

## How to Run

### Install dependencies

You can use one of them `npm`, `yarn`, `pnpm`, `bun`, Example using `npm`:

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

## Running via Docker

For production

```bash
docker build --build-arg ENV_FILE=.env.production -t mes-prod --target production .

docker run --env-file .env.production -p 3000:3000 mes-prod
```

For local testing or deployment

```bash
docker build -t nextjs-dev --target development .

docker run -p 3000:3000 -v ${PWD}:/app -v /app/node_modules nextjs-dev
```
## License

Licensed under the [MIT license](https://github.com/heroui-inc/next-app-template/blob/main/LICENSE).
