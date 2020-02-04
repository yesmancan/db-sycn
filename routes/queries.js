
const getTableAndColumnList = `
select 
	schema_name(tab.schema_id) as schema_name,
	tab.name as table_name, 
	col.column_id,
	col.name as column_name, 
	t.name as data_type,    
	col.is_nullable as column_isnull,
	tab.create_date as table_create_date,
	tab.modify_date as table_modify_date,
	col.max_length,
    col.precision,
    (SELECT CHARACTER_MAXIMUM_LENGTH from INFORMATION_SCHEMA.COLUMNS _col where _col.TABLE_NAME = tab.name and _col.COLUMN_NAME = col.name) as column_lenght
from sys.tables as tab
    inner join sys.columns as col on tab.object_id = col.object_id
    left join sys.types as t on col.user_type_id = t.user_type_id
order by schema_name,
    table_name, 
    column_id;
`;

module.exports.gettableandcolumnlist = getTableAndColumnList;