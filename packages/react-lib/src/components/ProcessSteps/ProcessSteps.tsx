import { Fragment } from 'react';
import { ProcessStep } from '@m2s2/models';
import './ProcessSteps.scss';

interface ProcessStepsProps {
  steps: ProcessStep[];
}

export function ProcessSteps({ steps }: ProcessStepsProps) {
  return (
    <ol className="ps-steps">
      {steps.map((step, i) => (
        <Fragment key={step.num}>
          <li className="ps-step">
            <span className="ps-num">{step.num}</span>
            <span className="ps-name">{step.name}</span>
            <span className="ps-desc">{step.desc}</span>
          </li>
          {i < steps.length - 1 && (
            <li className="ps-divider" aria-hidden="true">&#8594;</li>
          )}
        </Fragment>
      ))}
    </ol>
  );
}
