interface Course {
	id: string;
	image: string;
	title: string;
	subtitle: string;
	modules: string;
	cost: string;
	description: string;
}
const courses: Course[] = [
	{
		id: "starter",
		image: "/starter.svg",
		title: "Starter",
		subtitle: "Cursos",
		modules: "05",
		cost: "Gratuito",
		description:
			"Cursos 100% online e gratuitos para você entrar com o pé direito nas tecnologias mais desejadas do mercado.",
	},
	{
		id: "launchbase",
		image: "/launchbase.svg",
		title: "LaunchBase",
		subtitle: "Bootcamp",
		modules: "16",
		cost: "Pago",
		description:
			"Domine o desenvolvimento web do zero e acelere na direção dos seus objetivos.",
	},
	{
		id: "gostack",
		image: "/gostack.svg",
		title: "GoStack",
		subtitle: "Bootcamp",
		modules: "20",
		cost: "Pago",
		description:
			"Domine o back-end, o front-end e o mobile através do método que vai te guiar direto ao ponto na direção dos seus objetivos.",
	},
];

export default courses;
