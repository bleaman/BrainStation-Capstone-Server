exports.up = function (knex) {
	return knex.schema.createTable("users", function (table) {
		table.increments("id").primary();
		table.string("name").notNullable();
		table.string("email").unique().notNullable();
		table.string("password").notNullable();
		table.boolean("api_admin").notNullable().defaultTo(false);
		table.timestamps(true, true);
	});
};

exports.down = function (knex) {
	return knex.schema.dropTableIfExists("users");
};
