import { nomeDoStatus } from "../utils/formatar";
import type { StatusPedido } from "../types";

export default function StatusBadge({ status }: { status: StatusPedido }) {
  return <span className={"status status-" + status.toLowerCase()}>{nomeDoStatus(status)}</span>;
}
