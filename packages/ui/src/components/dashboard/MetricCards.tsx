import { ClipboardList, ClipboardCheck, Plus } from "lucide-react";
import React from "react";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../ui/card";

interface MetricsCardsProps {
	openCommandas: number;
	totalCommandas: number;
	onCreateComanda: () => void;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({
	openCommandas,
	totalCommandas,
	onCreateComanda,
}) => {
	return (
		<div className="grid gap-4 md:grid-cols-3 mb-6">
			<Card>
				<CardContent className="flex items-center justify-between p-6">
					<div className="space-y-1">
						<p className="text-sm text-muted-foreground">Comandas Abertas</p>
						<h2 className="text-3xl font-bold">{openCommandas}</h2>
					</div>
					<div className="p-4 bg-orange-100 rounded-full">
						<ClipboardList className="h-6 w-6 text-orange-600" />
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardContent className="flex items-center justify-between p-6">
					<div className="space-y-1">
						<p className="text-sm text-muted-foreground">Total de Comandas</p>
						<h2 className="text-3xl font-bold">{totalCommandas}</h2>
					</div>
					<div className="p-4 bg-blue-100 rounded-full">
						<ClipboardCheck className="h-6 w-6 text-blue-600" />
					</div>
				</CardContent>
			</Card>

			<Card className="bg-primary">
				<CardContent className="p-6">
					<Button
						className="w-full h-full flex items-center justify-center gap-2 text-lg"
						variant="secondary"
						onClick={onCreateComanda}
					>
						<Plus className="h-5 w-5" />
						Nova Comanda
					</Button>
				</CardContent>
			</Card>
		</div>
	);
};
