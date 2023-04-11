exports.up = function (knex) {
	return knex.schema.createTable("password_reset_tokens", function (table) {
		table.increments("id").primary();
		table.string("token").notNullable();
		table.integer("user_id").unsigned().notNullable();
		table.foreign("user_id").references("users.id");
		table.timestamps(true, true);
	});
};

exports.down = function (knex) {
	return knex.schema.dropTableIfExists("password_reset_tokens");
};
