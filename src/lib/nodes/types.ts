export interface NodeExecutorResult {
  outputData: any;
  handledCondition?: boolean;
  conditionResult?: boolean;
  handledLoop?: boolean;
  loopItems?: any[];
}
