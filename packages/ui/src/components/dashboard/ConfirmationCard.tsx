import React from "react";
import { useEffect, useRef } from "react";
import "./ConfirmationCard.css";
import { Check } from "lucide-react";

interface ConfirmationModalProps {
	isOpen: boolean;
	onConfirm: () => void;
	onCancel: () => void;
}

export default function ConfirmationModal({
	isOpen,
	onConfirm,
	onCancel,
}: ConfirmationModalProps) {
	const animationContainer = useRef(null);

	if (!isOpen) return null;

	return (
		<div className="overlay">
			<div className="modal">
				<div className="iconWrapper" ref={animationContainer}>
					<Check/>
				</div>
				<h2 className="confirm-title">Cadastrando comanda</h2>
				<p className="text">Deseja Cadastrar a comanda de numero 52?</p>
				<div className="btnGroup">
					<button onClick={onCancel} className="button buttonSecondary">
						Não
					</button>
					<button onClick={onConfirm} className="button buttonPrimary">
						Sim
					</button>
				</div>
			</div>
		</div>
	);
}
