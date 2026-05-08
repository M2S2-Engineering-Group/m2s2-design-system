import { Component, input } from '@angular/core';
import { ProcessStep } from '../../models/process-steps/process-steps.model';

@Component({
  selector: 'm2s2-process-steps',
  templateUrl: './process-steps.component.html',
  styleUrls: ['./process-steps.component.scss'],
  standalone: true,
})
export class ProcessStepsComponent {
  steps = input.required<ProcessStep[]>();
}
