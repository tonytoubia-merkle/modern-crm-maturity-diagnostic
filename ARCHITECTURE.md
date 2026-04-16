# Modern CRM Maturity Diagnostic — Process Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ENTRY POINTS                                      │
│                                                                             │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────────────────────┐  │
│   │  /project/new │    │ /assessment/ │    │  /assessment/chat            │  │
│   │              │    │    new       │    │  /marketing                  │  │
│   │  WORKSHOP    │    │  QUICK       │    │  CONVERSATIONAL              │  │
│   │  PROJECT     │    │  ASSESSMENT  │    │  ASSESSMENT                  │  │
│   └──────┬───────┘    └──────┬───────┘    └──────────────┬───────────────┘  │
│          │                   │                           │                  │
└──────────┼───────────────────┼───────────────────────────┼──────────────────┘
           │                   │                           │
           ▼                   │                           │
┌─────────────────────┐        │                           │
│ MULTI-STAKEHOLDER   │        │                           │
│ SURVEY DISTRIBUTION │        │                           │
│                     │        │                           │
│ Internal user:      │        │                           │
│ • Creates project   │        │                           │
│ • Adds stakeholders │        │                           │
│ • Generates unique  │        │                           │
│   survey links      │        │                           │
│ • Tracks completion │        │                           │
│   on dashboard      │        │                           │
│                     │        │                           │
│ Each stakeholder:   │        │                           │
│ • Receives link     │        │                           │
│ • Completes 30 Qs   │        │                           │
│ • Scored 1-5 per Q  │        │                           │
│                     │        │                           │
│ ┌─────┐ ┌─────┐    │        │                           │
│ │Stkh1│ │Stkh2│... │        │                           │
│ └──┬──┘ └──┬──┘    │        │                           │
│    │       │       │        │                           │
│    ▼       ▼       │        │                           │
│ ┌─────────────┐    │        │                           │
│ │ AGGREGATION │    │        │                           │
│ │ Average all │    │        │                           │
│ │ responses   │    │        │                           │
│ │ per question│    │        │                           │
│ │ + variance  │    │        │                           │
│ └──────┬──────┘    │        │                           │
└────────┼───────────┘        │                           │
         │                    │                           │
         │                    ▼                           ▼
         │           ┌──────────────────┐    ┌───────────────────────┐
         │           │ MANUAL SURVEY    │    │ AI CONVERSATION       │
         │           │                  │    │                       │
         │           │ 8 capability     │    │ Gemini 3 Flash chat   │
         │           │ sections, 30 Qs  │    │                       │
         │           │ 1-5 score pips   │    │ User talks naturally  │
         │           │ + "Not sure"     │    │ → AI infers 1-5      │
         │           │ + notes          │    │   scores from speech  │
         │           │ + industry Qs    │    │ → Coverage tracker    │
         │           │                  │    │   shows progress      │
         │           │ Single           │    │ → Voice I/O (Gemini   │
         │           │ respondent       │    │   TTS + Web Speech)   │
         │           │                  │    │                       │
         │           └────────┬─────────┘    └───────────┬───────────┘
         │                    │                          │
         ▼                    ▼                          ▼
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                    SHARED SCORING PIPELINE                           │
│                    (identical for all modes)                         │
│                                                                     │
│   ResponseItem[] ──→ computeCapabilityScores() ──→ 8 scores        │
│                      computeOverallScore()     ──→ 1 overall        │
│                      computeMaturityStage()    ──→ Stage 1-4        │
│                      getTriggeredOpportunities()→ Top 6 opps        │
│                                                                     │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
                    ▼             ▼             ▼
        ┌───────────────┐ ┌────────────┐ ┌──────────────────┐
        │ RESULTS PAGE  │ │ SALESFORCE │ │ WORKSHOP AGENDA  │
        │               │ │ OUTPUT     │ │ (projects only)  │
        │ • Maturity    │ │            │ │                  │
        │   stage card  │ │ • Account  │ │ • Vignettes      │
        │ • Capability  │ │   narrative│ │   matched to     │
        │   heatmap     │ │ • Opp      │ │   triggered opps │
        │ • Opportunity │ │   records  │ │ • De-duplicated  │
        │   cards       │ │ • Pipeline │ │   (no overlap)   │
        │ • Internal vs │ │   table    │ │ • Half/full/     │
        │   Client view │ │            │ │   two-day format │
        │               │ │            │ │ • Facilitation   │
        └───────┬───────┘ └─────┬──────┘ │   guides         │
                │               │        │ • SME RACI       │
                │               │        └────────┬─────────┘
                │               │                 │
                ▼               ▼                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         EXPORT & ACTIVATE                           │
│                                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────────────┐  │
│  │   PPTX   │  │  Share   │  │   Miro   │  │  Workshop          │  │
│  │  Export   │  │  Link    │  │  Board   │  │  Checklist         │  │
│  │          │  │          │  │  (auto-  │  │  + Email           │  │
│  │ Branded  │  │ Anyone   │  │  gen'd   │  │  Templates         │  │
│  │ slides   │  │ can view │  │  per     │  │  + Guide           │  │
│  │ per opp  │  │ via URL  │  │  vignette│  │  + Run of Show     │  │
│  └──────────┘  └──────────┘  │  or full │  └────────────────────┘  │
│                              │  workshop│                          │
│                              └──────────┘                          │
└─────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────┐
│                     8 CAPABILITY DIMENSIONS                         │
│                                                                     │
│  ┌──────────┐ ┌──────────┐ ┌────────────┐ ┌────────────┐          │
│  │ Identity │ │ Signals  │ │Decisioning │ │ Engagement │          │
│  │          │ │          │ │            │ │            │          │
│  │ Customer │ │ Behavioral│ │ NBA, AI,   │ │ Loyalty,   │          │
│  │ recog-   │ │ intent,  │ │ predictive │ │ journeys,  │          │
│  │ nition   │ │ real-time│ │ models     │ │ messaging  │          │
│  └──────────┘ └──────────┘ └────────────┘ └────────────┘          │
│  ┌──────────┐ ┌──────────┐ ┌────────────┐ ┌────────────┐          │
│  │  Media   │ │ Learning │ │ Technology │ │Organization│          │
│  │Activation│ │ & Optim. │ │            │ │ & Process  │          │
│  │          │ │          │ │ Stack,     │ │            │          │
│  │ 1st-party│ │ Test &   │ │ integration│ │ Cross-func │          │
│  │ data →   │ │ learn,   │ │ modularity │ │ alignment, │          │
│  │ paid     │ │ measure  │ │ governance │ │ governance │          │
│  └──────────┘ └──────────┘ └────────────┘ └────────────┘          │
│                                                                     │
│  + Optional: 5 industry-specific questions (Retail, QSR,           │
│    Financial Services, Travel & Hospitality, Automotive)            │
└─────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────┐
│                    MATURITY STAGES                                   │
│                                                                     │
│  Stage 1          Stage 2           Stage 3          Stage 4        │
│  Campaign-        Segmented         Orchestrated     Relationship   │
│  Centric          Engagement        Engagement       Growth Engine  │
│  ─────────────────────────────────────────────────────────────►     │
│  < 1.75           1.75 - 2.74       2.75 - 3.74     3.75+          │
│                                                                     │
│  Calendar-        Basic segments,   Signals drive    Fully          │
│  driven,          lifecycle         cross-channel    orchestrated,  │
│  siloed           messaging         orchestration    AI-powered     │
└─────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────┐
│                    OPPORTUNITY → WORKSHOP FLOW                      │
│                                                                     │
│  Low identity score                                                 │
│  ──→ triggers "Merkury Consumer 360" opportunity                   │
│      ──→ maps to "Identity & Data Value Mapping" vignette (90m)    │
│          ──→ SME: Identity Architect (must attend)                  │
│          ──→ Miro board auto-generated with exercise frames         │
│                                                                     │
│  Low signals score                                                  │
│  ──→ triggers "Real-Time Signal Capture" opportunity               │
│      ──→ maps to "Consumer Lifecycle Touchpoint Mapping" (120m)    │
│          ──→ SME: MarTech Architect (must attend)                   │
│                                                                     │
│  Low decisioning score                                              │
│  ──→ triggers "NBA Decisioning Engine" opportunity                 │
│      ──→ maps to "Next Best Action Design Workshop" (120m)         │
│          ──→ SME: Decisioning Architect (must attend)               │
│                                                                     │
│  Exclusion rules prevent overlapping vignettes:                     │
│  • Identity Data Mapping ↔ Tech Stack Audit (pick one)             │
│  • Lifecycle Touchpoint ↔ Signal Capture (pick one)                │
│  • Journey Orchestration ↔ Intelligence Loop (pick one)            │
│  • Human Loyalty ↔ Gamification (pick one)                         │
│                                                                     │
│  Agenda auto-sizes: ≤3 vignettes = half-day                       │
│                      4-5 = full-day                                 │
│                      6   = two-day                                  │
└─────────────────────────────────────────────────────────────────────┘
```
