export const getAge = (birthDate: Date) => {
	const age =
		new Date(
			//slice é necessário para remover a hora da string
			Date.parse(new Date().toISOString().slice(0, 10)) -
				Date.parse(new Date(birthDate).toISOString())
		).getFullYear() - 1970;
	return age;
};

export const getGraduation = (degree: string) => {
	switch (degree) {
		case "medio":
			return "Ensino Médio Completo";
		case "superior":
			return "Ensino Superior Completo";
		case "mestrado":
			return "Mestrado";
		case "doutorado":
			return "Doutorado";
		default:
			return "Não informado";
	}
};

export const getLessonType = (lessonType: string) => {
	return lessonType === "D"
		? "à Distância"
		: lessonType === "P"
		? "Presencial"
		: "Não informado";
};
