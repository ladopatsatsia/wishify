BEGIN TRANSACTION;
GO

ALTER TABLE [Cards] ADD [AutoSendRecipient] nvarchar(max) NULL;
GO

ALTER TABLE [Cards] ADD [IsAutoSend] bit NOT NULL DEFAULT CAST(0 AS bit);
GO

ALTER TABLE [Cards] ADD [IsPaid] bit NOT NULL DEFAULT CAST(0 AS bit);
GO

ALTER TABLE [Cards] ADD [IsSent] bit NOT NULL DEFAULT CAST(0 AS bit);
GO

ALTER TABLE [Cards] ADD [ScheduledDate] nvarchar(max) NULL;
GO

ALTER TABLE [Cards] ADD [ScheduledTime] nvarchar(max) NULL;
GO

ALTER TABLE [Cards] ADD [SendMethod] nvarchar(max) NULL;
GO

ALTER TABLE [Cards] ADD [UrlSlug] nvarchar(450) NULL;
GO

CREATE UNIQUE INDEX [IX_Cards_UrlSlug] ON [Cards] ([UrlSlug]) WHERE [UrlSlug] IS NOT NULL;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260322130203_AddAutoSendToCard', N'8.0.0');
GO

COMMIT;
GO

