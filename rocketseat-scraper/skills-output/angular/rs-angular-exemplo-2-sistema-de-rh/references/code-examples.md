# Code Examples: Sistema de RH em Angular

## Estrutura completa de features

```
src/app/
├── features/
│   ├── payroll/
│   │   ├── payroll.component.ts
│   │   ├── payroll.routes.ts
│   │   ├── components/
│   │   │   ├── salary-calculator/
│   │   │   ├── benefits-manager/
│   │   │   └── monthly-payment/
│   │   ├── models/
│   │   │   ├── employee-salary.model.ts
│   │   │   ├── payment-entry.model.ts
│   │   │   ├── benefit.model.ts
│   │   │   └── discount.model.ts
│   │   └── services/
│   │       └── payroll.service.ts
│   │
│   ├── recruitment/
│   │   ├── recruitment.component.ts
│   │   ├── recruitment.routes.ts
│   │   ├── components/
│   │   │   ├── job-listing/
│   │   │   ├── candidate-manager/
│   │   │   ├── selection-process/
│   │   │   └── interview-scheduler/
│   │   ├── models/
│   │   │   ├── job-opening.model.ts
│   │   │   ├── candidate.model.ts
│   │   │   ├── process-stage.model.ts
│   │   │   └── interview.model.ts
│   │   └── services/
│   │       └── recruitment.service.ts
│   │
│   └── performance/
│       ├── performance.component.ts
│       ├── performance.routes.ts
│       ├── components/
│       │   ├── evaluation-form/
│       │   ├── goals-tracker/
│       │   └── feedback-panel/
│       ├── models/
│       │   ├── evaluation.model.ts
│       │   ├── goal.model.ts
│       │   ├── feedback.model.ts
│       │   └── competency.model.ts
│       └── services/
│           └── performance.service.ts
│
├── core/
│   ├── services/
│   │   ├── auth.service.ts
│   │   └── http.service.ts
│   └── guards/
│       └── auth.guard.ts
│
└── shared/
    ├── components/
    │   ├── data-table/
    │   └── search-bar/
    └── pipes/
        └── currency.pipe.ts
```

## Rotas por feature

```typescript
// payroll.routes.ts
export const payrollRoutes: Routes = [
  {
    path: '',
    component: PayrollComponent,
    children: [
      { path: 'salaries', component: SalaryCalculatorComponent },
      { path: 'benefits', component: BenefitsManagerComponent },
      { path: 'payments', component: MonthlyPaymentComponent },
    ],
  },
];

// recruitment.routes.ts
export const recruitmentRoutes: Routes = [
  {
    path: '',
    component: RecruitmentComponent,
    children: [
      { path: 'openings', component: JobListingComponent },
      { path: 'candidates', component: CandidateManagerComponent },
      { path: 'interviews', component: InterviewSchedulerComponent },
    ],
  },
];

// performance.routes.ts
export const performanceRoutes: Routes = [
  {
    path: '',
    component: PerformanceComponent,
    children: [
      { path: 'evaluations', component: EvaluationFormComponent },
      { path: 'goals', component: GoalsTrackerComponent },
      { path: 'feedback', component: FeedbackPanelComponent },
    ],
  },
];
```

## Rota principal com lazy loading

```typescript
// app.routes.ts
export const appRoutes: Routes = [
  {
    path: 'payroll',
    loadChildren: () =>
      import('./features/payroll/payroll.routes').then((m) => m.payrollRoutes),
  },
  {
    path: 'recruitment',
    loadChildren: () =>
      import('./features/recruitment/recruitment.routes').then(
        (m) => m.recruitmentRoutes
      ),
  },
  {
    path: 'performance',
    loadChildren: () =>
      import('./features/performance/performance.routes').then(
        (m) => m.performanceRoutes
      ),
  },
];
```

## Modelos por dominio

```typescript
// features/payroll/models/employee-salary.model.ts
export interface EmployeeSalary {
  employeeId: string;
  baseSalary: number;
  benefits: Benefit[];
  discounts: Discount[];
}

// features/recruitment/models/candidate.model.ts
export interface Candidate {
  candidateId: string;
  name: string;
  jobOpeningId: string;
  currentStage: ProcessStage;
}

// features/performance/models/evaluation.model.ts
export interface Evaluation {
  evaluationId: string;
  employeeId: string;
  goals: Goal[];
  feedbacks: Feedback[];
  competencies: Competency[];
}
```

## Mapeamento requisitos → dominio → feature

```
REQUISITO: "Calcular salario, impostos, beneficios e gerar pagamento mensal"
  → DOMINIO: Folha de Pagamento
    → ENTIDADES: Funcionario, Lancamento, Beneficio, Desconto
      → FEATURE: /payroll
        → COMPONENTES: SalaryCalculator, BenefitsManager, MonthlyPayment

REQUISITO: "Gerenciar vagas, candidatos, processos seletivos e entrevistas"
  → DOMINIO: Recrutamento
    → ENTIDADES: Vaga, Candidato, EtapaProcesso, Entrevista
      → FEATURE: /recruitment
        → COMPONENTES: JobListing, CandidateManager, InterviewScheduler

REQUISITO: "Acompanhar desempenho dos funcionarios, metas e feedbacks"
  → DOMINIO: Performance
    → ENTIDADES: Avaliacao, Meta, Feedback, Competencia
      → FEATURE: /performance
        → COMPONENTES: EvaluationForm, GoalsTracker, FeedbackPanel
```