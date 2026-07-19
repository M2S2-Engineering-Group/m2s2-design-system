import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  HostListener,
  ViewChild,
  input,
  output,
  signal,
} from "@angular/core";
import { getStatusLabel as resolveStatusLabel } from "@m2s2/utils";
import type { ColumnDef } from "../../models/data-table/data-table.model";

@Component({
  selector: "m2s2-data-table",
  templateUrl: "./data-table.component.html",
  styleUrls: ["./data-table.component.scss"],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class DataTableComponent {
  @ViewChild("colWrap") private colWrap?: ElementRef;

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: Event): void {
    if (!this.colWrap?.nativeElement.contains(event.target)) {
      this.showCols.set(false);
    }
  }
  searchValue = input<string>("");
  searchPlaceholder = input<string>("Search…");
  statuses = input<string[]>([]);
  statusFilter = input<string>("all");
  statusLabels = input<Record<string, string>>({});
  columnDefs = input<ColumnDef[]>([]);
  colVisibility = input<Record<string, boolean>>({});
  totalCount = input<number>(0);
  filteredCount = input<number>(0);
  emptyMessage = input<string>("No data yet.");

  searchChange = output<string>();
  statusChange = output<string>();
  colToggle = output<string>();

  readonly showCols = signal(false);

  getStatusLabel(s: string): string {
    return resolveStatusLabel(s, this.statusLabels());
  }
}
