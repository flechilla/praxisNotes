import { reinforcementTypeEnum } from "../schema/reinforcement.table";

/**
 * Base type for reinforcement without organization association
 */
export type BaseReinforcement = {
  name: string;
  type: (typeof reinforcementTypeEnum.enumValues)[number];
  description?: string | null;
};
