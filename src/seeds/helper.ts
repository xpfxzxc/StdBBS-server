import { QueryRunner, TableForeignKey } from 'typeorm';

declare type RepeatCallback = (ith: number) => any;
declare type RepeatAsyncCallback = (ith: number) => Promise<any>;

export function repeat(times: number) {
  return (fn: RepeatCallback) => {
    for (let i = 1; i <= times; i++) {
      if (fn(i) === false) {
        break;
      }
    }
  };
}

export function repeatAsync(times: number, parallel = true) {
  return async (asyncFn: RepeatAsyncCallback) => {
    for (let i = 1; i <= times; i++) {
      if (parallel) asyncFn(i);
      else if ((await asyncFn(i)) === false) {
        break;
      }
    }
  };
}

export async function truncateTable(
  queryRunner: QueryRunner,
  tableName: string,
  ...referencedTableNames: string[]
): Promise<void> {
  const fkss = await Promise.all(
    referencedTableNames.map(async name => {
      const table = await queryRunner.getTable(name);
      const fks = Array.from(table.foreignKeys, fk => new TableForeignKey(fk));
      await queryRunner.dropForeignKeys(table, fks);
      return fks;
    }),
  );

  await queryRunner.clearTable(tableName);

  for (let i = 0; i < fkss.length; i++) {
    await queryRunner.createForeignKeys(referencedTableNames[i], fkss[i]);
  }
}
