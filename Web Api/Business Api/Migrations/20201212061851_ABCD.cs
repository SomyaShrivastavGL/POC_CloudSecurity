using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Business_Api.Migrations
{
    public partial class ABCD : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EmployeeResumes_Employees_EmployeeId",
                table: "EmployeeResumes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Employees",
                table: "Employees");

            migrationBuilder.DropIndex(
                name: "IX_EmployeeResumes_EmployeeId",
                table: "EmployeeResumes");

            migrationBuilder.DropColumn(
                name: "ID",
                table: "Employees");

            migrationBuilder.AlterColumn<string>(
                name: "PAN",
                table: "Employees",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(byte[]),
                oldType: "varbinary(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Employees",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EmployeeEmail",
                table: "EmployeeResumes",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Employees",
                table: "Employees",
                column: "Email");

            migrationBuilder.CreateIndex(
                name: "IX_EmployeeResumes_EmployeeEmail",
                table: "EmployeeResumes",
                column: "EmployeeEmail");

            migrationBuilder.AddForeignKey(
                name: "FK_EmployeeResumes_Employees_EmployeeEmail",
                table: "EmployeeResumes",
                column: "EmployeeEmail",
                principalTable: "Employees",
                principalColumn: "Email",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EmployeeResumes_Employees_EmployeeEmail",
                table: "EmployeeResumes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Employees",
                table: "Employees");

            migrationBuilder.DropIndex(
                name: "IX_EmployeeResumes_EmployeeEmail",
                table: "EmployeeResumes");

            migrationBuilder.DropColumn(
                name: "EmployeeEmail",
                table: "EmployeeResumes");

            migrationBuilder.AlterColumn<byte[]>(
                name: "PAN",
                table: "Employees",
                type: "varbinary(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Employees",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddColumn<int>(
                name: "ID",
                table: "Employees",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Employees",
                table: "Employees",
                column: "ID");

            migrationBuilder.CreateIndex(
                name: "IX_EmployeeResumes_EmployeeId",
                table: "EmployeeResumes",
                column: "EmployeeId");

            migrationBuilder.AddForeignKey(
                name: "FK_EmployeeResumes_Employees_EmployeeId",
                table: "EmployeeResumes",
                column: "EmployeeId",
                principalTable: "Employees",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
