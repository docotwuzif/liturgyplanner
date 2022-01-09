<template>
  <v-sheet>
    <v-toolbar>
      <v-toolbar-title>Benutzerverwaltung</v-toolbar-title>
      <v-spacer />
      <v-toolbar-items>
        <v-btn to="/users/import/aad" icon><v-icon>mdi-import</v-icon></v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-container>
      <v-row class="d-flex flex-wrap-reverse">
        <v-col cols="12" md="9">
          <v-sheet v-if="activeUser">
            <v-card>
              <v-card-title v-text="activeUser.name" />
              <v-card-subtitle
                >{{ activeUser.role }}
                <v-menu y-offset
                  ><template #activator="{ on, attrs }">
                    <v-icon v-bind="attrs" v-on="on">mdi-menu-down</v-icon>
                  </template>
                  <v-card
                    ><v-list
                      ><v-list-item
                        v-for="role in roles"
                        :key="role"
                        @click="setRole(role)"
                        dense
                        >{{ role }}
                      </v-list-item></v-list
                    ></v-card
                  >
                </v-menu>
              </v-card-subtitle>
              <v-card-text>
                <v-img
                  :src="`/api/users/${activeUser.id}/picture`"
                  width="120"
                  height="120"
                  class="grey"
                />
                <v-list-item>
                  <v-list-item-title>E-Mail</v-list-item-title>
                  <v-list-item-subtitle>{{
                    activeUser.email
                  }}</v-list-item-subtitle>
                </v-list-item>
              </v-card-text>
            </v-card>
            <v-card class="my-2">
              <v-expansion-panels>
                <v-expansion-panel>
                  <v-expansion-panel-header
                    >Qualifikationen</v-expansion-panel-header
                  >

                  <v-expansion-panel-content>
                    <v-checkbox
                      v-for="service in services"
                      :key="service.id"
                      v-model="activeUserServices"
                      :value="service.id"
                      dense
                      :label="service.name"
                    />
                    <v-btn text @click="saveQualifications">Speichern</v-btn>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card>
          </v-sheet>
        </v-col>
        <v-col cols="12" md="3" order="first">
          <v-list>
            <v-list-item
              v-for="user in users"
              :key="user.id"
              @click="setActiveUser(user)"
            >
              <v-list-item-title v-text="user.name" />
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { User, Service, UserRole } from '@prisma/client'

type _User = User & { qualifiedFor: Service[] }

@Component
export default class UserPage extends Vue {
  private activeUser: _User | null = null
  private activeUserServices: number[] = []

  private roles: string[] = ['ADMIN', 'EDITOR', 'USER', 'GUEST']

  async asyncData({ $axios }: { $axios: any }) {
    const users = await $axios.$get('/api/users')
    const services = await $axios.$get('/api/services')
    return { users, services }
  }

  setActiveUser(user: _User) {
    this.activeUser = user
    this.activeUserServices = user.qualifiedFor.map((x: Service) => x.id)
    window.scrollTo(0, 0)
  }

  async saveQualifications() {
    if (!this.activeUser) throw new Error('No user selected')
    await this.$axios.$put(`/api/users/${this.activeUser.id}`, {
      qualifiedFor: this.activeUserServices,
    })
    this.$nuxt.refresh()
  }

  async setRole(role: UserRole) {
    if (!this.activeUser) throw new Error('No user selected')
    this.$set(this.activeUser, 'role', role)
    await this.$axios.$put(`/api/users/${this.activeUser.id}`, {
      role,
    })
    this.$nuxt.refresh()
  }
}
</script>

<style scoped></style>
