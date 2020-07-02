interface Course {
	id: string;
	image: string;
	title: string;
	subtitle: string;
	modules: string;
	cost: string;
}
const courses: Course[] = [
	{
		id: "starter",
		image: "/starter.svg",
		title: "Starter",
		subtitle: "Cursos",
		modules: "05",
		cost: "Gratuito",
	},
	{
		id: "launchbase",
		image: "/launchbase.svg",
		title: "LaunchBase",
		subtitle: "Bootcamp",
		modules: "16",
		cost: "Pago",
	},
	{
		id: "gostack",
		image: "/gostack.svg",
		title: "GoStack",
		subtitle: "Bootcamp",
		modules: "20",
		cost: "Pago",
	},
];

export default courses;
