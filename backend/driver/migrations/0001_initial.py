# Generated by Django 4.2.4 on 2023-08-16 21:57

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Driver',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('phone', models.CharField(max_length=16)),
                ('license_number', models.CharField(max_length=20)),
            ],
            options={
                'db_table': 'driver',
            },
        ),
    ]
