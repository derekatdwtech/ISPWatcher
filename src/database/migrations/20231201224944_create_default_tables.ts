import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema
        .createTable('speed_test_results', function (table) {
            table.increments('id');
            table.dateTime('test_date').notNullable().defaultTo(new Date().getDate());
            table.decimal('speed_result', 20, 20).notNullable().defaultTo(0.0);
            table.boolean('is_successful').notNullable().defaultTo(true);
        })
        .createTable('ping_test_results', function (table) {
            table.increments('id');
            table.dateTime('test_date').notNullable().defaultTo(new Date().getDate());
            table.decimal('latency', 20, 20).notNullable();
            table.integer('packets_lost').notNullable().defaultTo(0);
            table.boolean('is_successful').notNullable().defaultTo(true);
        });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema
        .dropTable('ping_test_results')
        .dropTable('speed_test_results');
}

