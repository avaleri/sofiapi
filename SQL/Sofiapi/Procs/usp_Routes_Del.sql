use Sofiapi
go

create or alter proc [dbo].[usp_Routes_Del]
(@RouteID int)
as
begin

delete from [dbo].[Routes]
where RouteID = @RouteID

end
go
