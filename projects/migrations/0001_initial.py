# Generated by Django 3.1.3 on 2020-12-03 15:14

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('partners', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Participation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('participation', models.FloatField(default=0)),
                ('partner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='partners.partner')),
            ],
        ),
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('client', models.CharField(max_length=200, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('total_amount', models.BigIntegerField(default=0)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='projects', to=settings.AUTH_USER_MODEL)),
                ('participants', models.ManyToManyField(related_name='participants', through='projects.Participation', to='partners.Partner')),
            ],
        ),
        migrations.AddField(
            model_name='participation',
            name='project',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='projects.project'),
        ),
        migrations.CreateModel(
            name='Flow',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.BigIntegerField(default=1)),
                ('date', models.DateField(default=django.utils.timezone.now)),
                ('receipt_number', models.CharField(blank=True, max_length=200)),
                ('description', models.CharField(max_length=200)),
                ('confirmed', models.BooleanField(default=False)),
                ('partner', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='partners.partner')),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='flows', to='projects.project')),
            ],
        ),
        migrations.AlterUniqueTogether(
            name='participation',
            unique_together={('partner', 'project')},
        ),
    ]