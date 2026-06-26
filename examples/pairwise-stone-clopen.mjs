import * as analysis from "@emsenn/relating/analysis";

const receipt = analysis.pairwiseStoneClopen.receipt();

console.log("Pairwise Stone / Priestley FOUR dual");
console.log({
  points: receipt.space.points.map((point) => point.name),
  order: receipt.space.order,
  sigma: receipt.space.sigma,
  clopenCharges: receipt.lattice.table.map((row) => ({
    members: row.members,
    charge: row.charge,
  })),
  swapPotentialTo: receipt.swap.table.find((row) => row.charge === "potential")?.negatedCharge,
  tauPlusSize: receipt.topology.tauPlus.length,
  tauMinusSize: receipt.topology.tauMinus.length,
  orderRecoveredFromTauPlus: receipt.topology.orderRecoveredFromTauPlus,
  frontier: receipt.openFrontier,
});
