#import "/typst-package/lib.typ": render, render-svg

= Beautiful Mermaid Plugin Test

== Flowchart
#render(
  ```mermaid
  graph TD
    A[Hard edge] -->|Link text| B(Round edge)
    B --> C{Decision}
    C -->|One| D[Result one]
    C -->|Two| E[Result two]
  ```.text,
)

== Sequence Diagram
#render(
  ```mermaid
  sequenceDiagram
    Alice->>John: Hello John, how are you?
    loop Healthcheck
        John->>John: Fight against hypochondria
    end
    Note right of John: Rational thoughts <br/>prevail!
    John-->>Alice: Great!
    John->>Bob: How about you?
    Bob-->>John: Jolly good!
  ```.text,
)

== State Diagram
#render(
  ```mermaid
  stateDiagram-v2
    [*] --> Still
    Still --> [*]
    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]
  ```.text,
)

== Entity Relationship Diagram
#render(
  ```mermaid
  erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER }|..|{ DELIVERY-ADDRESS : uses
  ```.text,
)
