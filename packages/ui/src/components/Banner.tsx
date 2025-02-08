import React from "react";
import Button from "./banner/50off";

const Banner = () => {
	return (
		<div className="banner">
			<p className="promotion_bold">Pacotes Promocionais: </p>
			<p className="promotion">
				Plataforma + Automação via WhatsApp + Implementação + Aplicativo
			</p>
			<div className="btn-banner">
				<Button text="Até 50% Off!" />
			</div>
		</div>
	);
};

export default Banner;
