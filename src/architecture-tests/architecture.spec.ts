import "tsarch/dist/jest";
import { filesOfProject, slicesOfProject } from "tsarch";

jest.setTimeout(60000);

/* Assumptions de camadas:
   - src/features: regras de caso de uso / orchestration
   - src/infrastructure: detalhes de implementação (http, config)
   - src/interface: controllers/middlewares de interface
   - src/shared: utilidades e cross-cutting
   Ajuste conforme necessidade real. */

describe("Architecture rules", () => {
  it("features should be cycle free", async () => {
    const rule = filesOfProject()
      .inFolder("src/features")
      .should()
      .beFreeOfCycles();
    await expect(rule).toPassAsync();
  });

  it("shared should not depend on features", async () => {
    const rule = filesOfProject()
      .inFolder("src/shared")
      .shouldNot()
      .dependOnFiles()
      .inFolder("src/features");
    await expect(rule).toPassAsync();
  });

  it("features should not depend on interface layer", async () => {
    const rule = filesOfProject()
      .inFolder("src/features")
      .shouldNot()
      .dependOnFiles()
      .inFolder("src/interface");
    await expect(rule).toPassAsync();
  });

  it("interface may depend on features but not infrastructure directly", async () => {
    const rule = filesOfProject()
      .inFolder("src/interface")
      .shouldNot()
      .dependOnFiles()
      .inFolder("src/infrastructure");
    await expect(rule).toPassAsync();
  });


  it("slices must adhere to diagram (example)", async () => {
    const diagram = `@startuml
[features] --> [infrastructure]
[interface] --> [features]
[shared] --> [features]
@enduml`;
    const rule = slicesOfProject()
      .definedBy("src/(**)/.*")
      .should()
      .ignoringUnknownNodes()
      .adhereToDiagram(diagram);
    await expect(rule).toPassAsync();
  });
});
