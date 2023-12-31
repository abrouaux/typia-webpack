import typia from "typia";

export const checkIMember = typia.createIs<IMember>();

interface IMember {
  /**
   * @format uuid
   */
  id: string;

  /**
   * @format email
   */
  email: string;

  /**
   * @exclusiveMinimum 19
   * @maximum 100
   */
  age: number;
}
